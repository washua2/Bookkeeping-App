// components/bookList/bookList.js
Component({
  /**
   * 组件的属性列表, 用于接收父组件传递的数据(父子组件通讯)
   */
  //https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
  properties: {
    booking: {
      type: Object,
      value: {}
    },

    //是否显示删除按钮
    hasDelete: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //删除记账
    removeBooking(e) {
      //触发自定义事件通知父组件
      //this.triggerEvent(自定义事件名称,发射给父组件的参数);
      //this.triggerEvent('remove', {a: 100});
      let _id = e.currentTarget.dataset._id;
      // 
      this.triggerEvent('remove', {_id});
    }
  }
})
