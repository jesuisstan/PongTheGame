import React from 'react';

interface LinkDetectorProps {
  children: React.ReactNode;
}

const LinkDetector: React.FC<LinkDetectorProps> = ({ children }) => {
  const roll = typeof children === 'string' && /::rickroll/i.test(children);
  const nana = typeof children === 'string' && /::banana/i.test(children);
  const coco = typeof children === 'string' && /::coconut/i.test(children);
  const lyoko = typeof children === 'string' && /::code/i.test(children);
  if (roll) {
    return <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className='link'>
      {typeof children === 'string' && children.replace(/::rickroll/i, 'haha')}</a>;
  }
  if (nana) {
    return <a href="https://www.youtube.com/watch?v=bsqLi9LfiwM" target="_blank" rel="noopener noreferrer" className='link'>
      {typeof children === 'string' && children.replace(/::banana/i, 'haha')}</a>;
  }
  if (coco) {
    return <a href="https://www.youtube.com/watch?v=w0AOGeqOnFY" target="_blank" rel="noopener noreferrer" className='link'>
      {typeof children === 'string' && children.replace(/::coconut/i, 'haha')}</a>;
  }
  if (lyoko) {
    return <a href="https://www.youtube.com/watch?v=L8U-Fisq3Yk" target="_blank" rel="noopener noreferrer" className='link'>
      {typeof children === 'string' && children.replace(/::code/i, 'haha')}</a>;
  }
  const isLink = typeof children === 'string' && /^https?:\/\//.test(children);
  if (isLink) {
    return <a href={children as string} target="_blank" rel="noopener noreferrer" className='link'>{children}</a>;
  } else {
    return <span>{children}</span>;
  }
};

export default LinkDetector;
