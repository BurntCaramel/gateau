import R from 'ramda'
import React from 'react'
import { Seed } from 'react-seeds'
import Choice from '../ui/Choice'
import Field from '../ui/Field'
import { recordField } from '../stylers'

const types = [
    { value: 'string', title: 'Text' },
    { value: 'boolean', title: 'Yes / No' },
    { value: 'number', title: 'Number' },
    { value: 'array', title: 'List' },
    { value: 'object', title: 'Record' }
]

const valueEditorForType = R.cond([
    [ R.equals('string'), R.always((string) => <Field value={ string } { ...recordField } />) ],
    [ R.equals('boolean'), R.always((boolean) => <Choice value={ boolean } items={[ { value: true, title: 'Yes' }, { value: false, title:' No' } ]} />) ],
    [ R.equals('number'), R.always((number) => <input type='number' value={ number } />) ],
    [ R.equals('array'), () => (items) => <div>{ items.map((item, index) => <Item key={ index } id={ index } value={ item } /> ) }</div> ],
    [ R.equals('object'), () => (object) => <RecordEditor object={ object } /> ]
])

const valueEditorForValue = R.converge(
    R.call,
    [
        R.pipe(
            R.type,
            R.toLower,
            valueEditorForType
        ),
        R.identity
    ]
)

function Item({ id, value }) {
    return (
        <Seed column>
            <Seed row grow={ 1 }>
                <input value={ id } style={{ fontWeight: 'bold' }} />
                <Choice value={ R.type(value).toLowerCase() } items={ types } />
            </Seed>
            { valueEditorForValue(value) }
        </Seed>
    )
}

export default function RecordEditor({ object, ...seedProps }) {
    return (
        <Seed column { ...seedProps }>
        {
            Object.keys(object).map((key) => (
                <Item key={ key }
                    id={ key }
                    value={ object[key] }
                />
            ))
        }
        </Seed>
    )
}