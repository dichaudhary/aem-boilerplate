export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-video-${cols.length}-cols`);

  // setup image columns and video embeds
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-video-img-col');
        }
      }

      // Convert video links into embedded iframes
      const link = col.querySelector('a');
      if (link && link.href && link.href.includes('wistia.net/embed/iframe')) {
        const url = new URL(link.href);
        const videoId = url.pathname.split('/').pop();
        const wrapper = document.createElement('div');
        wrapper.className = 'columns-video-embed';
        const iframe = document.createElement('iframe');
        iframe.src = `https://fast.wistia.net/embed/iframe/${videoId}?videoFoam=true`;
        iframe.allow = 'autoplay; fullscreen';
        iframe.allowFullscreen = true;
        iframe.frameBorder = '0';
        iframe.title = link.textContent || 'Video';
        wrapper.append(iframe);
        // Replace the link container content
        col.textContent = '';
        col.append(wrapper);
        col.classList.add('columns-video-embed-col');
      }
    });
  });
}
