# WTT 

## Build 
```
 sudo docker build -t wtt-user:{ version } .
```
 ## Run 
```
 sudo docker run --rm -p {port}:8080 --env NODE_ENV={ env } tuannq/wtt:wtt-user-{version} (dev: 8081, main: 8181)
 ```
 ## Create tag
 ```
 sudo docker tag wtt-user:{ version } tuannq(repo)/wtt(group):wtt-user-{ version }
 ```
 ## Push tag
 ```
 sudo docker push tuannq(repo)/wtt(group):wtt-user-{ version }
 ```
 ## Pull tag
 ```
 sudo docker pull tuannq(repo)/wtt(group):wtt-user-{ version }
 ```
 ## View image 
 ```
 sudo docker image ls
 ```
 ## View container
 ```
 sudo docker container ls
 ```
 ## Stop
 ```
 sudo docker stop {container_id}
 ```
 ## Remove image
 ```
  sudo docker rmi {image_id}
 ```
 ## View process
 ```
  sudo docker ps
 ```
 ## Attach process
 ```
  sudo docker logs -f {id-process}
 ```
 