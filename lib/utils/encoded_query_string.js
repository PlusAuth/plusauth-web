export function encodedQueryString (data, appendable = true) {
  if (!data) return '';
  const ret = [];
  for (const d in data) {
    if (data[d] != null) ret.push(encodeURIComponent(d) + '=' + data[d]);
  }
  if (appendable) {
    return '?' + ret.join('&');
  } else {
    return ret.join('&');
  }
}
