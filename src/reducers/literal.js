// Copyright 2018, 2019 Stanford University see Apache2.txt for license

export const removeAllContent = (state, action) => {
  let newState = Object.assign({}, state)
  const reduxPath = action.payload.reduxPath
  let level = 0
  reduxPath.reduce((obj, key) => {
    level++
    if (level === reduxPath.length) {
      obj[key].items = []
    }
    return obj[key]
  }, newState)
  return newState
}

export const setMyItems = (state, action) => {
  let newState = Object.assign({}, state)
  const reduxPath = action.payload.reduxPath
  console.log(`in setMyItems`)
  console.warn(reduxPath, newState)
  let level = 0
  reduxPath.reduce((obj, key) => {
    level++
    console.log(`Level: ${level} ${key} ${level === reduxPath.length}`)
    if (level === reduxPath.length) {

      if ((key in obj) != true) {
        obj[key] = { items: [] }
      }
      action.payload.items.map((row) => {
        obj[key].items.push(row)
      })
    }
    if (!Object.keys(obj).includes(key)) {
      obj[key] = {}
    }
    // console.log(`object key ${obj[key]}`)
    return obj[key]
  }, newState)
  return newState
}

export const removeMyItem = (state, action) => {
  const newState = Object.assign({}, state)
  const reduxPath = action.payload.reduxPath
  let level = 0
  reduxPath.reduce((obj, key) => {
    level++
    if (level === reduxPath.length) {
      obj[key].items = obj[key].items.filter(
        row => row.id != action.payload.id)
    }
    return obj[key]
  }, newState)
  return newState
}
