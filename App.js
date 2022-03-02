import React from "react";
import {View} from 'react-native';
import Nav from "./src/nav";
import Geo from "./src/utils/Geo";
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootStore from "./src/mobx/index";
import { Provider } from "mobx-react";
import JPush from "jpush-react-native";

class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            //是否初始化高德地图
            isInitGeo:false,
        }
    }
    async componentDidMount(){
        //获取缓存中的用户手机号
        const strUserPhone = await AsyncStorage.getItem("LoginInfo")
        if(strUserPhone){
            rootStore.setUserInfo(strUserPhone)
        }else{
            rootStore.setUserInfo("")
        }
        JPush.init()
        JPush.getRegistrationID(async (result)=>{
            await AsyncStorage.setItem("registerID",result.registerID)
        })
        await Geo.initGeo()
        this.setState({isInitGeo:true})
        SplashScreen.hide();
    }
    componentWillUnmount(){
        this.setState({isInitGeo:false})
    }
    render(){
        return (
            <View style={{flex:1}}>
                <Provider rootStore={rootStore}>
                    {this.state.isInitGeo?<Nav></Nav>:<></>}
                </Provider>
            </View>
        );
    }
}

export default App;