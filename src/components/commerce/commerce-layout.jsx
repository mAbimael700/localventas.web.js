import React from 'react'
import { CommerceNav } from './commerce-nav'
import { ProductoCard } from './productos/producto-card'

export const CommerceLayout = () => {
  return (
    <div>
        <CommerceNav></CommerceNav>

      <ProductoCard></ProductoCard>

    </div>
  )
}
