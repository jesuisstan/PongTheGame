import { useEffect } from 'react';

function Load(color: { color: string }) {
  useEffect(() => {
    document.documentElement.style.setProperty('--circle-color', color.color);
  }, [color.color]);
  return (
    <div className="loader-circle" data-circle={color.color}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
export default Load;
