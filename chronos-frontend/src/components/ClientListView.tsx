import React from "react"
import { RowItem, ItemData } from "@/components/RowItem"
import { AddRowView } from "@/components/AddRowView"
import Loader from "react-spinners/PulseLoader"

type ClientListViewProps = {
  addItem: (name: string) => void
  deleteItem: (id: string) => void
  items: Array<ItemData>
  loading: boolean
}

function ClientListView({ addItem, deleteItem, items, loading }: ClientListViewProps) {
  return (
    <>
      <h2>Clients</h2>
      <p>View and manage clients.</p>

      {/* Show a loading indicator while loading */}
      {loading && <Loader color={"white"} />}
      {!loading && items.length === 0 && <div>Add your first client by filling in the field below</div>}
      {!loading && items.length > 0 && (
      <>
          {items.map((item, index) => {
          return <RowItem key={index} item={item} delete={deleteItem} />
          })}
      </>
      )}
      {!loading && <AddRowView addItem={addItem} />}
    </>
  )
}

export default ClientListView