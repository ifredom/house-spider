function getDataPrice(obj) {
  var result = []
  obj.forEach(function (item, index) {
    result.push(item.price)
  })
  return result
}
function getDataName(obj) {
  var result = []
  obj.forEach(function (item, index) {
    result.push(item.name)
  })
  return result
}