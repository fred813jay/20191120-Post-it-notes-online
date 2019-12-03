  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBlisQHxg0w-b9fadGLKautUalfSf35xf0",
    authDomain: "posttest-670fd.firebaseapp.com",
    databaseURL: "https://posttest-670fd.firebaseio.com",
    projectId: "posttest-670fd",
    storageBucket: "posttest-670fd.appspot.com",
    messagingSenderId: "1001647439305",
    appId: "1:1001647439305:web:45e55cde4dfed6319a3c18"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


var postitsRef = firebase.database().ref("postits")
postitsRef.on('value',(snapshot)=>{
  vm.postits = snapshot.val()
})  



var vm = new Vue({
  el: "#app",
  data: {
    colorList:[
      {
        name: "yellow",
        color: "#FFEB67"
      },
      {
        name: "blue",
        color: "#A5D8D6"
      },
      {
        name: "red",
        color: "#EF898C"
      },
      {
        name: "green",
        color: "#CBE196"
      },                  
    ],
    postits: [
      {
        text: "都市更新",
        color: "yellow",
        pos: { x:20 , y:0 }
      },
      {
        text: "市容整潔",
        color: "green",
        pos: { x:20 , y:300 }
      },
    ],
    nowId: -1,
    mousePosition: {
      x: 0,
      y: 0
    },
    StartMousePosition: {
      x: 0,
      y: 0
    }
  },
  watch: {
    mousePosition(){
      if (this.nowId != -1){
        let nowPosit = this.postits[this.nowId]
        nowPosit.pos.x = this.mousePosition.x-this.StartMousePosition.x
        nowPosit.pos.y = this.mousePosition.y-this.StartMousePosition.y
        postitsRef.child(this.nowId).set(nowPosit)
      }
      // console.log(this.mousePosition)
    },
  },
  methods: {
    getColor(name){
      return this.colorList.find(o=>o.name==name)
    },
    postitCss(p){
      return {
        left: p.pos.x+"px",
        top: p.pos.y+"px",
        fontSize: ( (240-10) / p.text.length)-10 +'px',
        backgroundColor: this.colorList.find(o=>o.name==p.color).color
      }
    },
    selectId(evt,id){
      // console.log(id)
      // console.log(evt)
      let isBlock = evt.srcElement.classList.contains("block")
      let isBtn = evt.srcElement.classList.contains("btn")
      if( !isBlock || !isBtn ){
        this.nowId = id;
        this.StartMousePosition={
          x: evt.offsetX,
          y: evt.offsetY
        }        
      }
      else {
        this.nowId = -1
      }
    },
    addPostit(){
      postitsRef.push({
        text: "Text",
        color: "yellow",
        pos: {x:Math.random()*1400,y:Math.random()*700}
      })
    },
    setText(pid){
      let edidText = prompt("請輸入新的文字",this.postits[pid].text)
      if (edidText){
        this.postits[pid].text= edidText;

        postitsRef.child(pid).set(this.postits[pid])
      }
    },
    setColor(pid,colorName){
        this.postits[pid].color= colorName
        postitsRef.child(pid).set(this.postits[pid])
    },
    deletePostit(pid){
      postitsRef.child(pid).remove()
    },
    deleteAllPostit(){
      postitsRef.remove()
    },
  },
})


window.onmousemove=(evt)=>{
    vm.mousePosition={ x:evt.pageX,y:evt.pageY }
    // vm.mousePosition.x=evt.pageX
    // vm.mousePosition.y=evt.pageY
    // vm.postits[vm.nowId].pos.x=evt.pageX
    // vm.postits[vm.nowId].pos.y=evt.pageY    

}

window.onmouseup=(e)=>{
  vm.nowId = -1
}
