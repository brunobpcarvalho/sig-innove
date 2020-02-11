//carregando módulos
require("dotenv").config();
const express = require('express');
const router = express.Router();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const Index = require("./routes/Index")

const Pessoa = require("./routes/Pessoa");
const Usuario = require("./routes/Usuario");
const Empresa = require("./routes/Empresa");

const Categoria = require("./routes/Categoria");
const Fabricante = require("./routes/Fabricante");
const Modelo = require("./routes/Modelo");

const Produto = require("./routes/Produto");

const Venda = require("./routes/Venda");

const ContasReceber = require("./routes/ContasReceber");
const ContasPagar = require("./routes/ContasPagar");

const path = require("path");
const session = require('cookie-session');
const flash = require('connect-flash');
const moment = require('moment');
const passport = require("passport");
require("./config/auth")(passport);

/*----------------------------------------------------------------------------*/

//Configurações
	//Sessão
	app.use(session({
		secret: "f1306605fc98209c44499314874211a0", // sistema innove
		resave: true,
		saveUninitialized: true
	}));

	app.use(passport.initialize());
	app.use(passport.session());
	//Flash
	app.use(flash());
	//MiddleWare
	app.use((req, res, next) => {
		res.locals.msg_sucesso = req.flash("msg_sucesso");
		res.locals.msg_erro = req.flash("msg_erro");
		res.locals.error = req.flash("error");
		res.locals.user = req.user || null;
		next();
	});

	//Body parser
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());

	//handlebars
	app.engine('handlebars', handlebars({
		defaultLayout: 'main',
		helpers: {
			formatDate: (date) => {
				return moment(date).format('DD/MM/YYYY')
			},
			ifCond: (v1, v2, options) => {
				if(v1 === v2) {
					return options.fn(this);
				}
				return options.inverse(this);
			}
		}
	}));
	app.set('view engine', 'handlebars');

	var conexao = require("./config/conexao");

	//Public
	app.use(express.static(path.resolve(__dirname, "public")));

	/*----------------------------------------------------------------------------*/

//Rotas
app.get('/', (req, res) => {
	res.render("usuarios/login");
})

app.use(Index)
app.use('/pessoas', Pessoa);
app.use('/usuarios', Usuario);
app.use('/empresa', Empresa);
app.use('/produtos', Categoria);
app.use('/produtos', Fabricante);
app.use('/produtos', Modelo);
app.use('/produtos', Produto);
app.use('/vendas', Venda);
app.use('/contas-receber', ContasReceber);
app.use('/contas-pagar', ContasPagar);


app.use((req, res, next) => {
	const erro = new Error('Not found')
	erro.status = 404
	next(erro)
})

app.use((error, req, res, next) => {
	res.status(error.status || 500)
	res.render('error', { error: error });
})

/*----------------------------------------------------------------------------*/

//Servidor
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
	console.log("Servidor rodando");
});
