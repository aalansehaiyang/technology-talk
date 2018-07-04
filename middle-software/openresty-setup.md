## openresty安装
---


#### 官方安装地址

http://openresty.org/cn/installation.html

其中最简单的方式是通过brew命令安装


#### Mac OS下包管理器Homebrew的安装与使用

```
https://www.jianshu.com/p/d229ac7fe77d
```

#### 安装openresty

一键命令

```
brew install openresty/brew/openresty

```

默认安装目录：

```
/usr/local/Cellar/openresty/1.13.6.2
```

```
-rw-r--r--   1 onlyone  admin    22K  5 15 04:24 COPYRIGHT
-rw-r--r--   1 onlyone  admin   792B  7  4 19:22 INSTALL_RECEIPT.json
-rw-r--r--   1 onlyone  admin   4.6K  5 15 04:24 README.markdown
drwxr-xr-x   9 onlyone  admin   306B  7  4 19:22 bin
-rw-r--r--   1 onlyone  admin   583B  7  4 19:22 homebrew.mxcl.openresty.plist
drwxr-xr-x   6 onlyone  admin   204B  7  4 19:22 luajit
drwxr-xr-x   6 onlyone  admin   204B  7  4 19:22 lualib
drwxr-xr-x  10 onlyone  admin   340B  7  4 19:55 nginx
drwxr-xr-x  44 onlyone  admin   1.5K  7  4 19:22 pod
-rw-r--r--   1 onlyone  admin   219K  7  4 19:22 resty.index
drwxr-xr-x   5 onlyone  admin   170B  7  4 19:22 site
```
nginx的配置文件地址

```
/usr/local/etc/openresty
```

```
-rw-r--r--  1 onlyone  admin   1.1K  7  4 19:22 fastcgi.conf
-rw-r--r--  1 onlyone  admin   1.1K  7  4 19:22 fastcgi.conf.default
-rw-r--r--  1 onlyone  admin   1.0K  7  4 19:22 fastcgi_params
-rw-r--r--  1 onlyone  admin   1.0K  7  4 19:22 fastcgi_params.default
-rw-r--r--  1 onlyone  admin   2.8K  7  4 19:22 koi-utf
-rw-r--r--  1 onlyone  admin   2.2K  7  4 19:22 koi-win
-rw-r--r--  1 onlyone  admin   171B  7  4 20:09 lua.conf
-rw-r--r--  1 onlyone  admin   5.0K  7  4 19:22 mime.types
-rw-r--r--  1 onlyone  admin   5.0K  7  4 19:22 mime.types.default
-rw-r--r--  1 onlyone  admin   518B  7  4 19:48 nginx.conf
-rw-r--r--  1 onlyone  admin   2.6K  7  4 19:22 nginx.conf.default
-rw-r--r--  1 onlyone  admin   2.6K  7  4 19:22 nginx.conf_1
-rw-r--r--  1 onlyone  admin   636B  7  4 19:22 scgi_params
-rw-r--r--  1 onlyone  admin   636B  7  4 19:22 scgi_params.default
-rw-r--r--  1 onlyone  admin   664B  7  4 19:22 uwsgi_params
-rw-r--r--  1 onlyone  admin   664B  7  4 19:22 uwsgi_params.default
-rw-r--r--  1 onlyone  admin   3.5K  7  4 19:22 win-utf
```

#### nginx配置lua脚本

将系统默认的nginx.conf备份nginx.conf_1

新建nginx.conf

```
 #user  nobody;
worker_processes  2;

error_log  logs/error.log;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  text/html;

    #lua模块路径，其中”;;”表示默认搜索路径，默认到/usr/servers/nginx下找
    lua_package_path "/usr/local/Cellar/openresty/1.13.6.2/lualib/?.lua;;";  #lua 模块  
    lua_package_cpath "/usr/local/Cellar/openresty/1.13.6.2/lualib/?.so;;";  #c模块   
    
    include /usr/local/etc/openresty/lua.conf;

}
```

lua.conf

```
server {
    listen       8081;
    server_name  _;

    location /lua {
        default_type 'text/html';
          content_by_lua  'ngx.say("hello world")';
    }
}

```

注意：1024以下的端口需要以root权限来启动，这里设定为8081

http://blog.sina.com.cn/s/blog_4adc4b090102vxpz.html

#### 启动

```
cd /usr/local/Cellar/openresty/1.13.6.2

--启动
sudo nginx/sbin/nginx

-- 停止
sudo nginx/sbin/nginx -s stop

-- 重启
sudo nginx/sbin/nginx -s reload

-- 检验nginx配置是否正确
sudo nginx/sbin/nginx -t
```

浏览器访问：http://localhost:8081/lua

```
hello world
```

#### 参考

* http://jinnianshilongnian.iteye.com/blog/2186270