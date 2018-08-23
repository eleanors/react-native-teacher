/**
 * Created by heaton on 2018/1/8.
 */
import {observable,action} from 'mobx';
class ClassBiz{
    @observable
    refresh = false;
    @observable
    className = '';

    @action
    setClassName(className){
        this.className = className;
    }

    @action
    mustRefresh(){
        console.log('hasNew  ++  true');
        this.refresh = true;
    }
    @action
    refreshComplete(){
        console.log('hasNew  ++  false');
        this.refresh = false;
    }
};
const Instance = new ClassBiz();
export default Instance;