import { shallow } from 'enzyme'
import React from 'react'
import App from './App'

test('renders without failing', ()=>{
    let wrapper = shallow(<App />)

    expect(wrapper).toBeDefined()
})

test('able to change theme based on context',()=>{
    let wrapper = shallow(<App />)
    let instance = wrapper.instance()

    expect(wrapper.state('theme')).toEqual('light')
    instance.contextUpdate({theme:'dark'},['theme'])
    expect(wrapper.state('theme')).toEqual('dark')
})
