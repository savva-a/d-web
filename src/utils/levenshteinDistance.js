export default function levenshteinDistance(_a, _b) {
  let a = _a;
  let b = _b;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let tmp;
  let i;
  let j;
  let prev;
  let val;
  // let row;
  // swap to save some memory O(min(a,b)) instead of O(a)
  if (a.length > b.length) {
    tmp = a;
    a = b;
    b = tmp;
  }

  const row = Array(a.length + 1);
  // init the row
  for (i = 0; i <= a.length; i += 1) {
    row[i] = i;
  }

  // fill in the rest
  for (i = 1; i <= b.length; i += 1) {
    prev = i;
    for (j = 1; j <= a.length; j += 1) {
      if (b[i - 1] === a[j - 1]) {
        val = row[j - 1]; // match
      } else {
        val = Math.min(row[j - 1] + 1, // substitution
              Math.min(prev + 1,     // insertion
                       row[j] + 1));  // deletion
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[a.length] = prev;
  }
  return row[a.length];
  // /////////////////////////////////////////////
  // if (a.length == 0) return b.length;
  // if (b.length == 0) return a.length;
  //
  // const matrix = [];
  //
  //  // increment along the first column of each row
  // let i;
  // for (i = 0; i <= b.length; i++) {
  //   matrix[i] = [i];
  // }
  //
  //  // increment each column in the first row
  // let j;
  // for (j = 0; j <= a.length; j++) {
  //   matrix[0][j] = j;
  // }
  //
  //  // Fill in the rest of the matrix
  // for (i = 1; i <= b.length; i++) {
  //   for (j = 1; j <= a.length; j++) {
  //     if (b.charAt(i - 1) == a.charAt(j - 1)) {
  //       matrix[i][j] = matrix[i - 1][j - 1];
  //     } else {
  //       matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
  //                                Math.min(matrix[i][j - 1] + 1, // insertion
  //                                         matrix[i - 1][j] + 1)); // deletion
  //     }
  //   }
  // }
  //
  // return matrix[b.length][a.length];
}
