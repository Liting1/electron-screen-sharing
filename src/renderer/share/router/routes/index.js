import Home from '@s/views/Home';

export default [{
    path: '/',
    redirect: 'home'
},{
    path: '/home',
    name: 'home',
    component: Home
}]