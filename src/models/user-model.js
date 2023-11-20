'use restrict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    nickname: {
        type: String,
        required: [true, 'O nome é obrigatório'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória'],
    },
    city:{
        type:String,
        required: [true, 'A cidade do usuário é obrigatória']
    },
    protection_code: {
        type: String,
        required: false
    },
    indexQuestion:{
        type:Number,
        required:[false,'O index da questão respondida é obrigatório']
    },
    answerQuestion:{
        type:String,
        required:[false,'A resposta da questão é obrigatória']
    },
    aleatory_questions: [
        {
            type: String,
            required: [false, 'As questões aleatorias é obrigatória']
        }
    ],
    isAleatoryQuestionsResponded:{
        type:Boolean,
        required: false,
        default:false
    },

    roles: [
        {
            type: String,
            required: [true, 'O tipo de permissão é obrigatória'],
            enum: ['user', 'admin'],
            default: 'user'
        }
    ]
});

module.exports = mongoose.model('User', schema);