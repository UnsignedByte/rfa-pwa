# rfa-pwa
robotics for all thing

### todo
- add pwa functionality
- add cookies to detect previous page
- rejigger so it lookz niaze
- google analytics
- change font, maybe look into convert to real materialize
- hide logo when screen size is too small
# pipe dream
- react native rewrite

## Instructions to work on backend

### [params folder](params/)

The following files represent the files that need to be present inside the params folder in the main directory.

#### params.json

The default params.json looks like

```json
{
	"FOLDER_ID":"ID OF CURRICULUM FOLDER"
}
```

The only requirement here is to place in the ID of the curriculum folder, which can be found on the drive of the `app@roboticsforall.net` account. This can be found easily by opening the curriculum folder, and when inside, the url should be of the form `https://drive.google.com/drive/folders/<Folder ID>` where the area represented by the angular brackets represents the folder ID. Simply copy this and replace `ID OF CURRICULUM FOLDER` with this text. Remember not to leave the surrounding quotations.

#### credentials.json

This can be obtained from google console. First, go to [console.cloud.google.com](https://console.cloud.google.com/) and log in with `app@roboticsforall.net`. Under the **Select a project** dropdown, choose `Curriculum-Access-API`