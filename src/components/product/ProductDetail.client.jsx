// @ts-expect-error @headlessui/react incompatibility with node16 resolution
import {Disclosure} from '@headlessui/react';
import {Link} from '@shopify/hydrogen';

import {Text, IconClose} from '~/components';

export function ProductDetail({title, content, learnMore}) {
  return (
    <>
      <Disclosure key={title} as="div" className="grid w-full gap-2 py-8">
        {/* @ts-expect-error @headlessui/react incompatibility with node16 resolution */}
        {({open}) => (
          <>
            <h4 className="newboc">
              {title}
            </h4>
            {/* <Disclosure.Button className="text-left">
            <div className="flex justify-between">
              <IconClose
                className={`${
                  open ? '' : 'rotate-[45deg]'
                } transition-transform transform-gpu duration-200`}
              />
            </div>
          </Disclosure.Button> */}

            <div
              // className="prose dark:prose-invert"
              className=""
              dangerouslySetInnerHTML={{__html: content}}
            />
            {/* <Disclosure.Panel className={'pb-4 pt-2 grid gap-2'}>
            {learnMore && (
              <div className="">
                <Link
                  className="pb-px border-b border-primary/30 text-primary/50"
                  to={learnMore}
                >
                  Learn more
                </Link>
              </div>
            )}
          </Disclosure.Panel> */}
          </>
        )}
      </Disclosure>
    </>
  );
}
