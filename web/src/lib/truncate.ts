//TODO: better way of doing this
function truncate(str: string, to: number = 140) {
  if (str.length >= 140) {
    return str.slice(0, to) + " ...";
  }
  return str;
}

export default truncate;
