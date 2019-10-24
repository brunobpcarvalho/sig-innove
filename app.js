//carregando módulos
const express = require('express');
const router = express.Router();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const rPessoa = require("./routers/rPessoa");
const rUsuario = require("./routers/rUsuario");
const rProduto = require("./routers/rProduto");
const rVenda = require("./routers/rVenda");
const path = require("path");
const session = require('express-session');
const flash = require('connect-flash');
const moment = require('moment');
const passport = require("passport");
require("./config/auth")(passport);

const {User} = require("./helpers/User")
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
      }
    }
  }));
  app.set('view engine', 'handlebars');

	var conexao = require("./config/conexao");

	//Public
	app.use(express.static(path.join(__dirname, "public")));

/*----------------------------------------------------------------------------*/

//Rotas
	app.get('/', (req, res) => {
		res.render("usuarios/login");
	})
	app.get('/index', User, (req, res) => {
		res.render("index");
	})

	app.use('/pessoas', rPessoa);
	app.use('/usuarios', rUsuario);
	app.use('/produtos', rProduto);
	app.use('/vendas', rVenda);

/*----------------------------------------------------------------------------*/

//Servidor
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
	console.log("Servidor rodando");
});
