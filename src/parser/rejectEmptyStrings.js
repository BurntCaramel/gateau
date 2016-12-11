import R from 'ramda'

const rejectEmptyStrings = R.filter(R.test(/\S/))

module.exports = rejectEmptyStrings
