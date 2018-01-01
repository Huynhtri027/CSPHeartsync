var mongodb = require('mongodb').MongoClient,
    sendMessage = require('../../api/facebookAPI/sendMessage'),
    url = 'mongodb://localhost:27017';

var chooseFavorite = (senderId, gender) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            db.db('cspheartsync').collection('users').update({ _id: senderId.toString() }, { $set: { favorite: gender } }, (err, res) => {
                if (err) throw err;
                if (gender === 'male') { resolve("Bạn ghép đôi tiếp theo của bạn sẽ là một bạn nam nhá :D ") }
                if (gender === 'female') { resolve("Bạn ghép đôi tiếp theo của bạn sẽ là một bạn nữ nhá :D") }
                if (gender === 'none') { resolve("Bạn ghép đôi tiếp theo có thể là nam hay nữ đều được nhé :D") }
                db.db('cspheartsync').collection('pending').count ({_id : senderId.toString ()}).then (
                    count => 
                    {
                        if (count > 0) 
                        {
                            sendMessage.sendBotMessage (senderId, "Để cho thay đổi có hiệu lực, hãy nhắn end để ra khỏi hàng đợi và nhắn tin bất kỳ để trở lại hàng đợi", "Cảm ơn bạn nhiều")
                        }
                    }
                )
            })
        })
    })
}


module.exports = { chooseFavorite: chooseFavorite }