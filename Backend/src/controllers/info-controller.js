const express = require('express');
const { StatusCodes } = require('http-status-codes');

const info = (req, res) => {
    return res.status(StatusCodes.OK).json({
        success: true,
        message: "APi is working",
        error: {},
        data: {}
    })
}

module.exports = {
    info
}