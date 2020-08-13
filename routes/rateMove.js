module.exports = {
  rateMove(ruch, previouslyRated, answer) {
    const ruchRated = [];
    const rated = previouslyRated;
    let black = 0;
    let white = 0;
    for (let i = 0; i < ruch.length; i += 1) {
      ruchRated[i] = false;
    }
    for (let i = 0; i < ruch.length; i += 1) {
      if (rated[i]) continue;
      if (ruch[i] === answer[i]) {
        ruchRated[i] = true;
        rated[i] = true;
        black += 1;
      }
    }
    for (let i = 0; i < ruch.length; i += 1) {
      if (ruchRated[i]) continue;
      for (let j = 0; j < answer.length; j += 1) {
        if (rated[j]) continue;
        if (ruch[i] === answer[j]) {
          ruchRated[i] = true;
          rated[j] = true;
          white += 1;
        }
      }
    }
    return [rated, black, white];
  },
};
