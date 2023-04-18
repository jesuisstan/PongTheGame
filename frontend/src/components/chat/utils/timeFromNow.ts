export default function timeFromNow(timestamp: Date) {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1 && interval < 2) return interval + ' year';
  else if (interval >= 2) return interval + ' years';
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1 && interval < 2) return interval + ' month';
  else if (interval >= 2) return interval + ' months';
  interval = Math.floor(seconds / 86400);
  if (interval >= 1 && interval < 2) return interval + ' day';
  else if (interval >= 2) return interval + ' days';
  interval = Math.floor(seconds / 3600);
  if (interval >= 1 && interval < 2) return interval + ' hour';
  else if (interval >= 2) return interval + ' hours';
  interval = Math.floor(seconds / 60);
  if (interval >= 1 && interval < 2) return interval + ' min';
  else if (interval >= 2) return interval + ' mins';
  else return 'now';
}
