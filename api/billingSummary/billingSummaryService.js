const _ = require('lodash')
const BillingCycles = require('../billingCycle/billingCycle')

// Middleware
function getSummary(req, res){
    BillingCycles.aggregate([{
            $project: {credit: { $sum : "$credits.value" }, debt: { $sum : "$debts.value" }}
        }, {
            $group: {_id: null, credits: {$sum: "$credit"}, debts: {$sum: "$debt"}}
        }, {
            $project: {_id: 0, credits:1, debts:1 }
        }], function (error, result) {
            if(error){
                res.status(500).json({errors: [error]})
            }else {
                res.json(_.defaults(result[0], { credits:0, debts:0})) //_.defaults se o objeto n conter os 
                //elementos apresentar como default o valor setado
            }
        })
}

module.exports = { getSummary }