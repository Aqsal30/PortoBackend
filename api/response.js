const response = (statusCode, Data, Message, res) => {
res.status(statusCode).json({
    payload: Data,
    Message,
    metadata: {
        prev: "",
        next: "",
        current: ""
    }
})
}

module.exports = response