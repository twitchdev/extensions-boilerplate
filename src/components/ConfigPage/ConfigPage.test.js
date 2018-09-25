import { shallow } from 'enzyme'
import React from 'react'
import ConfigPage from './ConfigPage'

test('renders without failing', ()=>{
    let wrapper = shallow(<ConfigPage />)

    expect(wrapper).toBeDefined()
})