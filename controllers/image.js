
const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('imageInput', 1)
    .returning('imageInput')
    .then(imageInput => {
        res.json(imageInput[0]);
    })
    .catch(err => res.status(400).json('unable to get count'))
}

module.exports = {
    handleImage: handleImage
}