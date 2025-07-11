##### 1、进入项目
```
cd alpaca-ui
```

##### 2、安装环境

* 2.1、安装nodejs
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```
```
source ~/.bashrc
```
或
```
source ~/.bash_profile
```
或
```
source ~/.zshrc
```
```
nvm install 20
```
```
nvm use 20.17.0
```

* 2.2、安装python
```
python3 --version
```
```
alias python=python3
```

* 2.3、安装依赖
```
npm install
```

##### 3、启动服务
```
npm run dev
```

##### 4、打包服务

* 4.1、测试环境
```
npm run build:test
```

* 4.2、生产环境
```
npm run build:prod
```# xim-ui
