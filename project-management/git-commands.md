## git常用命令

---

* 	git branch -a      

  	查看所有的分支，包括本地和远程
   
*	git checkout -b develop remotes/origin/develop   

	切换远程开发分支在本地创建影像
	
*	git status 

	查看文件的修改状态 
	
*	git add src/main/java/com/onlyone/csw/controllers/Test.java 

	标记需要提交的文件，支持*通配符
	
*	git commit -m “备注”  

	将本地修改保存到本地仓库中，并添加备注
	
*	git push

	将本地仓库修改推送到服务器上的仓库中
	
*	git pull 

	同步服务器最新内容到本地
	
*	git checkout 分支名        

	在分支之间切换 
	
*	git merge 分支a   

	将分支a内容合到当前分支上，最后要执行git commit 和 git push

*	git branch -d 分支名      

	删除本地分支（删之前需要切换非当前分支）

*	git branch 分支名       

	在本地库创建新的分支

*	git push -u origin 分支名     

	提交本地创建的分支到远程服务器	

```
第一次创建新应用，最后提交到master
git push -u origin master
```
	
*	git diff  topic  maste    

	直接将两个分支上最新的提交做diff	
	
* 	git diff
	
	查看当前未提交的文件的改动点
	
*	git branch -v -v     

	有【】的表示和服务器关联
	
*	git reset --hard HEAD~3  

	会将最新的3次提交全部重置，只在本地生效 （http://www.cnblogs.com/mliudong/archive/2013/04/08/3007303.html）
	
	git push -f origin 分支名 
	
	强制提交到远程服务器，此时回退了3个版本，git服务器的提交log也会清掉。


*  已经commit 了N次，需要退回到某一版本

```
git reset <commit-id>  #默认就是-mixed参数。
修改代码 或者  git checkout 撤销修改
git push -f 强制提交

ps：查看git log，会发现原来已经提交过的log也会被删除

```	

*  git stash
   
   多分支开发，本地缓存。https://www.cnblogs.com/tocy/p/git-stash-reference.html
 
*	git branch 

	查看所有本地分支，带*为当前分支	
	
*	git log  

	查看当前分支的提交记录

*	git log -p   

	查看代码改动点（所有）


