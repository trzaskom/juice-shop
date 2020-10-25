/*
 * Copyright (c) 2014-2020 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

/* jslint node: true */
const insecurity = require('../lib/insecurity')
const utils = require('../lib/utils')
const challenges = require('../data/datacache').challenges

module.exports = (sequelize, {STRING, INTEGER}) => {
    const Feedback = sequelize.define('Feedback', {
        comment: {
            type: STRING,
            set(comment) {
                this.setDataValue('comment', insecurity.sanitizeSecure(comment))
            }
        },
        rating: {
            type: INTEGER,
            allowNull: false,
            set(rating) {
                this.setDataValue('rating', rating)
                utils.solveIf(challenges.zeroStarsChallenge, () => {
                    return rating === 0
                })
            }
        }
    })

    Feedback.associate = ({User}) => {
        Feedback.belongsTo(User) // no FK constraint to allow anonymous feedback posts
    }

    return Feedback
}
