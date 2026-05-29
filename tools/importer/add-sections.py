#!/usr/bin/env python3
"""
Post-processor: Split single-section insurance-landing pages into
multi-section pages by inserting div boundaries at block elements.

Each block (identified by class name) starts a new section.
Default content between blocks stays in the preceding section.
Section-metadata blocks are added where styles are needed.
"""

import os
import re
import sys
from html.parser import HTMLParser

CONTENT_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'content', 'personal', 'insurance')

# Block names that mark new section boundaries
SECTION_BLOCKS = [
    'hero-quote',
    'columns-video',
    'cards-action',
    'cards-tile',
    'columns-banner',
    'columns-info',
    'accordion-faq',
    'columns-cta',
]

# Styles to apply to sections starting with these blocks
BLOCK_STYLES = {
    'hero-quote': 'dark-blue',
}

# For sections with columns-info that contain "Common auto coverages" or similar
# definitions sections, apply grey style
GREY_CONTENT_MARKERS = [
    'Common auto coverages',
    'Common coverages',
    'coverage options',
    'Auto insurance terminology',
    'Insurance terminology',
]


def section_metadata_html(style):
    return f'<div class="section-metadata"><div><div>style</div><div>{style}</div></div></div>'


class BlockFinder(HTMLParser):
    """Find positions of block divs and metadata div at depth 1 (direct children of root div)."""

    def __init__(self, html):
        super().__init__()
        self.html = html
        self.depth = 0
        self.root_depth = None
        self.blocks = []  # [(start_pos, class_name, block_name)]
        self.metadata_start = None
        self._last_start = None
        self._last_tag_start = None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        if tag == 'div':
            self.depth += 1
            if self.root_depth is None:
                self.root_depth = self.depth
                return

            if self.depth == self.root_depth + 1:
                attrs_dict = dict(attrs)
                cls = attrs_dict.get('class', '')
                # Check if this is a block
                for block_name in SECTION_BLOCKS:
                    if block_name in cls:
                        pos = self.getpos()
                        self.blocks.append((pos, cls, block_name))
                        break
                # Check if it's metadata
                if cls == 'metadata':
                    pos = self.getpos()
                    self.metadata_start = pos

    def handle_endtag(self, tag):
        if tag == 'div':
            self.depth -= 1


def get_offset(html, line, col):
    """Convert line/col position to character offset."""
    lines = html.split('\n')
    offset = sum(len(lines[i]) + 1 for i in range(line - 1))
    return offset + col


def find_div_start(html, line, col):
    """Find the start of the <div that contains position line:col."""
    offset = get_offset(html, line, col)
    # Search backwards for '<div'
    search_start = max(0, offset - 10)
    idx = html.rfind('<div', search_start, offset + 5)
    if idx == -1:
        idx = html.rfind('<div', 0, offset + 5)
    return idx


def process_file(filepath):
    """Process a single .plain.html file to add section breaks."""
    with open(filepath, 'r') as f:
        content = f.read()

    # Check current section count
    class DivCounter(HTMLParser):
        def __init__(self):
            super().__init__()
            self.depth = 0
            self.count = 0
        def handle_starttag(self, tag, attrs):
            if tag == 'div':
                if self.depth == 0:
                    self.count += 1
                self.depth += 1
        def handle_endtag(self, tag):
            if tag == 'div':
                self.depth -= 1

    counter = DivCounter()
    counter.feed(content)

    if counter.count > 5:
        return f"SKIP (already {counter.count} sections)"

    # For pages with very few sections, we need to split the main content
    # Find all block boundaries within the content
    finder = BlockFinder(content)

    if len(finder.blocks) < 2:
        return f"SKIP (only {len(finder.blocks)} blocks found)"

    # Strategy: Split the content at each block boundary
    # The content between blocks becomes default content in the preceding section

    # Find character offsets for each block
    block_offsets = []
    for (line, col), cls, block_name in finder.blocks:
        offset = find_div_start(content, line, col)
        if offset >= 0:
            block_offsets.append((offset, cls, block_name))

    # Also find metadata section
    metadata_offset = None
    if finder.metadata_start:
        line, col = finder.metadata_start
        metadata_offset = find_div_start(content, line, col)

    if not block_offsets:
        return "SKIP (could not locate block offsets)"

    # Sort by position
    block_offsets.sort(key=lambda x: x[0])

    # Now split the content into sections
    # Content structure: <div> ... content ... </div>
    # We need to find the outer wrapper div boundaries

    # Find the first '<div>' and last '</div>'
    first_div = content.find('<div>')
    if first_div == -1:
        first_div = content.find('<div ')

    # Content inside the first top-level div
    # Find its closing tag - it's the last </div> in the file (or before metadata)
    last_close = content.rfind('</div>')

    # Get the inner content (between first <div>...</div>)
    inner_start = content.find('>', first_div) + 1
    inner_content = content[inner_start:last_close]

    # Split inner content at block boundaries (adjusted for inner offset)
    sections = []
    prev_end = 0

    for offset, cls, block_name in block_offsets:
        # Adjust offset relative to inner content
        adj_offset = offset - inner_start
        if adj_offset < 0:
            continue

        # Default content before this block
        if adj_offset > prev_end:
            default_content = inner_content[prev_end:adj_offset].strip()
            if default_content:
                sections.append(('default', default_content, None))

        # Find the end of this block div
        # We need to find the matching </div>
        depth = 0
        i = adj_offset
        block_end = None
        while i < len(inner_content):
            if inner_content[i:i+4] == '<div':
                depth += 1
                i += 4
            elif inner_content[i:i+6] == '</div>':
                depth -= 1
                if depth == 0:
                    block_end = i + 6
                    break
                i += 6
            else:
                i += 1

        if block_end is None:
            block_end = len(inner_content)

        block_content = inner_content[adj_offset:block_end].strip()
        style = BLOCK_STYLES.get(block_name)

        # Check for grey style markers in columns-info sections
        if block_name == 'columns-info':
            for marker in GREY_CONTENT_MARKERS:
                # Check content right before this block for the marker
                preceding = inner_content[max(0, adj_offset-500):adj_offset]
                if marker in preceding:
                    style = 'grey'
                    break

        sections.append(('block', block_content, style, block_name))
        prev_end = block_end

    # Remaining content after last block
    remaining = inner_content[prev_end:].strip()
    if remaining:
        # Check if it contains metadata div
        if '<div class="metadata">' in remaining:
            # Split metadata out
            meta_idx = remaining.find('<div class="metadata">')
            before_meta = remaining[:meta_idx].strip()
            meta_content = remaining[meta_idx:].strip()
            if before_meta:
                sections.append(('default', before_meta, None))
            sections.append(('metadata', meta_content, None))
        else:
            sections.append(('default', remaining, None))

    # Build output - each section is a top-level <div>
    output_parts = []
    for section in sections:
        section_type = section[0]
        content_html = section[1]
        style = section[2]

        if style:
            output_parts.append(f'<div>{content_html}{section_metadata_html(style)}</div>')
        else:
            output_parts.append(f'<div>{content_html}</div>')

    output = '\n'.join(output_parts) + '\n'

    # Verify we have more sections than before
    verify_counter = DivCounter()
    verify_counter.feed(output)

    if verify_counter.count <= counter.count:
        return f"SKIP (no improvement: {counter.count} -> {verify_counter.count})"

    with open(filepath, 'w') as f:
        f.write(output)

    return f"DONE ({counter.count} -> {verify_counter.count} sections)"


def main():
    if not os.path.isdir(CONTENT_DIR):
        print(f"Error: {CONTENT_DIR} not found")
        sys.exit(1)

    files = sorted([
        os.path.join(CONTENT_DIR, f)
        for f in os.listdir(CONTENT_DIR)
        if f.endswith('.plain.html')
    ])

    print(f"Processing {len(files)} insurance pages...")
    for filepath in files:
        name = os.path.basename(filepath).replace('.plain.html', '')
        result = process_file(filepath)
        print(f"  {name}: {result}")


if __name__ == '__main__':
    main()
