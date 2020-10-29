const mysql = require('mysql'),
      async = require('async'),
      db = require('../config/db')
let pool = mysql.createPool(db.mysql)

pool.on('exit',()=>{
    pool.end()
})

/**
 * 执行查询
 * @param sql
 * @param params
 * @param callback
 */
function query(sql, params, callback) {
    if (typeof params === 'function') {
        callback = params;
        params = [];
    }
    async.waterfall([
        function(cb) {
            pool.getConnection(cb);
        },
        function(conn, cb) {
            conn.query(sql, params, (err, res) => {
                cb(err, conn, res);
            });
        }
    ], function(err, conn, result) {
        try {
            if (conn) {
                conn.release();
            }
            callback(err, result);
        } catch (e) {
            callback(e, null);
        }
    });
}

/**
 * 无事物执行SQL  ces
 * @param sql
 * @param params
 * @param callback
 */
function excute(sql, params, callback) {
    if (_.isFunction(params)) {
        callback = params;
        params = [];
    }
    async.waterfall([
        function(cb) {
            pool.getConnection(cb);
        },
        function(conn, cb) {
            conn.execute(sql, params, (err, rows) => {
                cb(err, conn, rows);
            });
        }
    ], function(err, conn, result) {
        try {
            if (conn) {
                conn.release();
            }
            callback(err, result);
        } catch (e) {
            callback(e, null);
        }

    });
}

/**
 * 有事物执行
 * @param callback
 */
function excuteWithTransation(excuteFn, callback) {
    async.waterfall([
        function(cb) {
            pool.getConnection(cb);
        },
        function(conn, cb) {
            conn.beginTransaction((err) => {
                cb(err, conn);
            });
        },
        function(conn, cb) {
            excuteFn(conn, (err, result) => {
                if (err) {
                    conn.rollback(() => {
                        cb(err, conn);
                    });
                } else {
                    conn.commit((err) => {
                        if (err) {
                            conn.rollback(() => {
                                cb(err, conn);
                            });
                        } else {
                            cb(err, conn);
                        }
                    });
                }
            });
        },

    ], function(err, conn) {
        try {
            if (conn) {
                conn.release();
            }
            callback(err);
        } catch (e) {
            callback(e, null);
        }
    });
}


let DBUtil = {
    /**
     * 查询
     */
    query: query,
    /**
     * 执行
     */
    excute: excute,
    /**
     * 有事物处理
     */
    txexcute: excuteWithTransation

};

module.exports = DBUtil;