export default function timeFromNow(timestamp: Date) {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  
  if (interval >= 1) {
    return interval + ' years';
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + ' months';
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + ' days';
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + ' hours';
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + ' min';
  }
  if (seconds < 25) {
    return 'now';
  }
  return Math.floor(seconds) + ' sec';
}
