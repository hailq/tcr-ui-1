export function createSalt() {
  const length = 66;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

// export function getVoteJSON() {
//   return {"voteOption":"1","numTokens":"20","commitEnd":"06/29/18__15:43:20","revealEnd":"06/29/18__15:48:20","listingID":"First Listing","salt":"330764384501360484429143231803135317312154684475544222148645023741","pollID":"9","secretHash":"0x5287f021db6ddeede1e837356f180eab30dad1a9b4c6505e8ba44b97e124c934","account":"0xb6984c37e20c1b9cd4afe48cdb2f41da5b0cef39"}
// }

export function toMinuteAndSecond(seconds) {
  let minutes = Math.floor(seconds / 60).toString();
  let remainingSeconds = (seconds % 60).toString();
  if (minutes.length == 1) minutes = '0' + minutes;
  if (remainingSeconds.length == 1) remainingSeconds = '0' + remainingSeconds;
  return `${minutes}:${remainingSeconds}`;
}