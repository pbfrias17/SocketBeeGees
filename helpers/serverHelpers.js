export const FindRoom = function(rooms, roomNumber) {
  for (var i; i < rooms.Length; i++) {
    if (rooms[i].roomNumber === roomNumber) {
      return rooms[i];
    }
  }

  return undefined;
};