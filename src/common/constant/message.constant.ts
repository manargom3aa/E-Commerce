const generateMessage = (entity: string) => ({
    notFound: `${entity} not found`,
    alreadyExist: `${entity} already exists`,
    created: `${entity} created successfully`,
    updated: `${entity} updated successfully`,
    deleted: `${entity} deleted successfully`,
    failToCreate: `${entity} fail to create`,
    failToUpdate: `${entity} fail to update`,
    failToDelete: `${entity} fail to delete`,

})

export const message={
    Category: { ...generateMessage('Category') },
    Brand: { ...generateMessage('Brand') },
    Product: { ...generateMessage('Product') },
    Coupon: { ...generateMessage('Coupon') },
}