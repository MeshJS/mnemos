[**@meshsdk/common**](../README.md)

***

[@meshsdk/common](../globals.md) / maybeStakingHash

# Function: maybeStakingHash()

> **maybeStakingHash**(`stakeCredential`, `isStakeScriptCredential`): [`MaybeStakingHash`](../type-aliases/MaybeStakingHash.md)

Defined in: [data/json/credentials.ts:58](https://github.com/MeshJS/mesh/blob/1abde1553cbd7cf2cf4e40197fc0de9e4a7d0f49/packages/mesh-common/src/data/json/credentials.ts#L58)

The utility function to create a Plutus Data staking hash in JSON

## Parameters

### stakeCredential

`string`

The staking credential in hex

### isStakeScriptCredential

`boolean` = `false`

The flag to indicate if the credential is a script credential

## Returns

[`MaybeStakingHash`](../type-aliases/MaybeStakingHash.md)

The Plutus Data staking hash object
