export function sortByKey(array, key, { date }: { date?: boolean }) {
  return array.sort(function (a, b) {
    var x = date ? new Date(a[key]).getTime() : a[key];
    var y = date ? new Date(b[key]).getTime() : b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
}
