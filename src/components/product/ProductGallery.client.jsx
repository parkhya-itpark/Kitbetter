import React, {useState} from 'react';
import {MediaFile} from '@shopify/hydrogen/client';
import {ATTR_LOADING_EAGER} from '~/lib/const';
import { CartControl } from '../global/CartControl.client';

/**
 * A client component that defines a media gallery with a vertical thumbnail slider for hosting images, 3D models, and videos of products
 */
export function ProductGallery({media, className , title, menu}) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  if (!media.length) {
    return null;
  }

  const selectedMedia = {
    ...media[selectedMediaIndex],
    image: {
      ...media[selectedMediaIndex].image,
      altText: media[selectedMediaIndex].alt || 'Product image',
    },
  };

  let mediaProps = {};

  switch (selectedMedia.mediaContentType) {
    case 'IMAGE':
      mediaProps = {
        width: 800,
        widths: [400, 800, 1200, 1600, 2000, 2400],
      };
      break;
    case 'VIDEO':
      mediaProps = {
        width: '100%',
        autoPlay: true,
        controls: false,
        muted: true,
        loop: true,
        preload: 'auto',
      };
      break;
    case 'EXTERNAL_VIDEO':
      mediaProps = {width: '100%'};
      break;
    case 'MODEL_3D':
      mediaProps = {
        width: '100%',
        interactionPromptThreshold: '0',
        ar: true,
        loading: ATTR_LOADING_EAGER,
        disableZoom: true,
      };
      break;
  }

  if (selectedMediaIndex === 0 && selectedMedia.mediaContentType === 'IMAGE') {
    mediaProps.loading = ATTR_LOADING_EAGER;
  }

  const mainMediaStyle =
    'aspect-square snap-center card-image bg-white dark:bg-contrast/10 w-full h-full';

  return (
    <div className={`product-gallery ${className}`}>
      <CartControl title={title} menu={menu} />
      <div className="main-media">
        <MediaFile
          className={mainMediaStyle}
          data={selectedMedia}
          sizes="(min-width: 64em) 60vw, (min-width: 48em) 50vw, 90vw"
          {...mediaProps}
        />
      </div>
      <div className="thumbnails">
        {media.map((med, i) => {
          const thumbnailMedia = {
            ...med,
            image: {
              ...med.image,
              altText: med.alt || 'Product image',
            },
          };
          return (
            <div
              key={med.id || med.image.id}
              className={`thumbnail ${
                selectedMediaIndex === i ? 'selected' : ''
              }`}
              onClick={() => setSelectedMediaIndex(i)}
            >
              <MediaFile
                className="thumbnail-image"
                data={thumbnailMedia}
                options={{
                  crop: 'center',
                  scale: 2,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
