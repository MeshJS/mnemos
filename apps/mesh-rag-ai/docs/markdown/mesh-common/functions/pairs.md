[**@meshsdk/common**](../README.md)

***

[@meshsdk/common](../globals.md) / pairs

# Function: pairs()

> **pairs**\<`K`, `V`\>(`mapItems`, `validation`): [`Pairs`](../type-aliases/Pairs.md)\<`K`, `V`\>

Defined in: [data/json/primitives.ts:175](https://github.com/MeshJS/mesh/blob/1abde1553cbd7cf2cf4e40197fc0de9e4a7d0f49/packages/mesh-common/src/data/json/primitives.ts#L175)

The utility function to create a Plutus Data Pairs in JSON

## Type Parameters

### K

`K`

### V

`V`

## Parameters

### mapItems

\[`K`, `V`\][]

The items map in array

### validation

`boolean` = `true`

Default true - If current data construction would perform validation (introducing this flag due to possible performance issue in loop validation)

## Returns

[`Pairs`](../type-aliases/Pairs.md)\<`K`, `V`\>

The Plutus Data Pairs object
