var router = require('express').Router();


router.post('/api/post', (req, res, next) => {
  const { body } = req;
  const {
    name
  } = body;
  let {
    rate
  } = body;
  console.log('Please');
  // Steps:
  // 1. Verify email doesn't exist
  // 2. Save
  

});

module.exports = router;

