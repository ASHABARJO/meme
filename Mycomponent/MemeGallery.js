import { PhotoSwipe } from 'react-photoswipe';
import { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
// import PhotoSwipe from 'photoswipe';
// import 'photoswipe/dist/photoswipe.css';


const MemeGallery = () => {
  const [memes, setMemes] = useState([]);
  const [after, setAfter] = useState(null);
  const [isPhotoSwipeOpen, setPhotoSwipeOpen] = useState(false);
  const [photoSwipeIndex, setPhotoSwipeIndex] = useState(0);

  
  useEffect(() => {
    fetchMemes();
  }, []);
  
  const fetchMemes = async () => {
    
    try {
      const url = `https://www.reddit.com/r/memes.json${after ? `?after=${after}` : ''}`;
      const response = await axios.get(url);
      const newMemes = response.data.data.children.map((child) => child.data);
      setMemes((prevMemes) => [...prevMemes, ...newMemes]);
      setAfter(response.data.data.after);
    } 
    catch (error) {
      console.error('Error fetching memes:', error);
    }
  };
 


  const openPhotoSwipe = (index) => {
    const pswpElement = document.querySelectorAll('.pswp');
    const items = memes.map((meme) => ({
      src: meme.url,
      w: meme.preview.images[0].source.width,
      h: meme.preview.images[0].source.height,
    }));

    const options = {
      index,
      history: false,
    };
    const gallery = new openPhotoSwipe(pswpElement, PhotoSwipe.Default, items, options);
    gallery.init();
    
    
  };

  const handleImageClick = (index) => {
    setPhotoSwipeIndex(index);
    setPhotoSwipeOpen(true)
  };
  const handleClosePhotoSwipe = () => {
    setPhotoSwipeOpen(false);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      fetchMemes();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
 
  return (
    <div>
      <div className="gallery">
      
      <InfiniteScroll
        dataLength={memes.length}
        next={fetchMemes}
        hasMore={after !== null}
        loader={<h4>Loading...</h4>}
      >
        <div className="gallery">
          {memes.map((meme, index) => (
            <div key={index} className="thumbnail" onClick={() => handleImageClick(index)}>
              <img src={meme.thumbnail} alt={`Meme ${index}`} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
      {isPhotoSwipeOpen && (
      <PhotoSwipe
        isOpen={isPhotoSwipeOpen}
        items={memes.map((meme) => ({
          src: meme.url,
          w: meme.preview.images[0].source.width,
          h: meme.preview.images[0].source.height,
        }))}
        options={{
          index: photoSwipeIndex,
          history: false,
        }}
        onClose={handleClosePhotoSwipe}
      />
    )}
  
      <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="pswp__bg"></div>
        <div className="pswp__scroll-wrap">
          <div className="pswp__container">
            <div className="pswp__item"></div>
            <div className="pswp__item"></div>
            <div className="pswp__item"></div>
          </div>
          <div className="pswp__ui pswp__ui--hidden">
            <div className="pswp__top-bar">
              <div className="pswp__counter"></div>
              <button className="pswp__button pswp__button--close" title="Close (Esc)"></button>
              <button className="pswp__button pswp__button--share" title="Share"></button>
              <button className="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
              <button className="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
              <div className="pswp__preloader">
                <div className="pswp__preloader__icn">
                  <div className="pswp__preloader__cut">
                    <div className="pswp__preloader__donut"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
              <div className="pswp__share-tooltip"></div>
            </div>
            <button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
            </button>
            <button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
            </button>
            <div className="pswp__caption">
              <div className="pswp__caption__center"></div>
            </div>
          </div>
        </div>
        </div>
        </div>
     </div>
  );
};

export default MemeGallery;
