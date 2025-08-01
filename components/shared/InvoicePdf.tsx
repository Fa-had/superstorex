'use client'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { IOrder } from '@/lib/db/models/order.model'

const styles = StyleSheet.create({
  page: {
    padding: 32, // like p-8
    fontFamily: 'Helvetica',
    fontSize: 12,
    backgroundColor: '#F9FAFB', // tailwind gray-100
  },
  container: {
    position: 'relative',
  },
  heading: {
    fontSize: 20, // text-2xl
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16, // mb-4
    color: '#1F2937', // text-gray-800
  },
  section: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#D1D5DB', // border-gray-300
    paddingBottom: 4,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB', // border-gray-200
  },
  normalrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  total: {
    marginTop: 16,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 14,
  },
  salesection: {
    position: 'relative',
    width: '100%',
  },
  col: {
    width: '50%',
    position: 'absolute',
    right: 0,
  },
})

export const InvoicePdf = ({ order }: { order: IOrder }) => (
  <Document title='Invoice' author='SuperstoreX'>
    <Page size='A4' style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.heading}>Purchase Receipt</Text>
        <View style={styles.section}>
          <Text>Customer: {order.deliveryAddress?.fullName}</Text>
          <Text>Address: {order.deliveryAddress?.street}</Text>
          <Text>Phone: {order.deliveryAddress?.phone}</Text>
          <Text>City: {order.deliveryAddress?.city}</Text>
          <Text>
            Created:{' '}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString()
              : 'No date'}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={{ flex: 0.3 }}>SL.</Text>
            <Text style={{ flex: 3 }}>Item</Text>
            <Text style={{ flex: 1 }}>Price</Text>
            <Text style={{ flex: 0.5 }}>Qty</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>Total</Text>
          </View>

          {order.items.map((item, index) => (
            <View style={styles.row} key={item.product}>
              <Text style={{ flex: 0.3 }}>{index + 1}</Text>
              <Text style={{ flex: 3, paddingRight: 10 }}>{item.name}</Text>
              <Text style={{ flex: 1 }}>{item.price}</Text>
              <Text style={{ flex: 0.5 }}>{item.quantity}</Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>
                {item.price * item.quantity}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.salesection}>
          <View style={styles.col}>
            <View style={styles.normalrow}>
              <Text style={{ flex: 2 }}>Sub Total:</Text>
              <Text style={{ textAlign: 'right' }}>
                {'Tk. '}
                {order.itemsPrice}
              </Text>
            </View>
            <View style={styles.normalrow}>
              <Text style={{ flex: 2 }}>Delivery Charge:</Text>
              <Text style={{ textAlign: 'right' }}>
                {'Tk. '}
                {order.deliveryCharge}
              </Text>
            </View>
            <View style={styles.normalrow}>
              <Text style={{ flex: 2 }}>Cash to Collect*:</Text>
              <Text style={{ textAlign: 'right' }}>
                {'Tk. '}
                {order.totalPrice}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
)
