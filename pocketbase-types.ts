/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Messages = "messages",
	MobileMerchants = "mobile_merchants",
	OrderItems = "order_items",
	Orders = "orders",
	PopularProductGroups = "popular_product_groups",
	ProductCategories = "product_categories",
	ProductRating = "product_rating",
	ProductReviews = "product_reviews",
	Products = "products",
	SiteAdmins = "site_admins",
	Tags = "tags",
	UserPaymentPreferences = "user_payment_preferences",
	UserProfiles = "user_profiles",
	Users = "users",
	Variants = "variants",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type MessagesRecord = {
	created?: IsoDateString
	email?: string
	from?: string
	id: string
	message?: string
	phone?: string
	subject?: string
	updated?: IsoDateString
}

export type MobileMerchantsRecord = {
	code?: string
	created?: IsoDateString
	id: string
	logo?: string
	merchant_code?: string
	number_codes?: string
	provider?: string
	recipient_number?: string
	updated?: IsoDateString
}

export type OrderItemsRecord = {
	created?: IsoDateString
	id: string
	img_link?: string
	name?: string
	price?: number
	product?: RecordIdString
	quantity?: number
	updated?: IsoDateString
}

export enum OrdersStateOptions {
	"PAYMENT_PENDING" = "PAYMENT_PENDING",
	"DELIVERY_PENDING" = "DELIVERY_PENDING",
	"FULFILLED" = "FULFILLED",
	"CANCELLED" = "CANCELLED",
}
export type OrdersRecord = {
	created?: IsoDateString
	delivery_cost?: number
	delivery_date?: IsoDateString
	fulfilled_date?: IsoDateString
	id: string
	name?: string
	order_items: RecordIdString[]
	payment_method?: RecordIdString
	payment_verified_date?: IsoDateString
	state?: OrdersStateOptions
	total_cost?: number
	updated?: IsoDateString
	user?: RecordIdString
}

export type PopularProductGroupsRecord = {
	cover?: string
	created?: IsoDateString
	id: string
	name?: string
	products?: RecordIdString[]
	updated?: IsoDateString
}

export type ProductCategoriesRecord = {
	created?: IsoDateString
	id: string
	name?: string
	updated?: IsoDateString
}

export type ProductRatingRecord = {
	created?: IsoDateString
	id: string
	product?: RecordIdString
	rating?: number
	updated?: IsoDateString
	user?: RecordIdString
}

export type ProductReviewsRecord = {
	created?: IsoDateString
	id: string
	message?: string
	product?: RecordIdString
	updated?: IsoDateString
	user?: RecordIdString
}

export type ProductsRecord = {
	category?: RecordIdString
	cover_image?: string
	created?: IsoDateString
	description?: HTMLString
	id: string
	media?: string[]
	name?: string
	price?: number
	tags?: RecordIdString[]
	updated?: IsoDateString
}

export type SiteAdminsRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type TagsRecord = {
	created?: IsoDateString
	id: string
	name?: string
	updated?: IsoDateString
}

export enum UserPaymentPreferencesTypeOptions {
	"MOBILE" = "MOBILE",
	"CARD" = "CARD",
	"CASH" = "CASH",
}
export type UserPaymentPreferencesRecord = {
	card_display_name?: string
	card_expiry_date?: string
	card_number?: string
	created?: IsoDateString
	id: string
	mobile_display_name?: string
	mobile_number?: string
	name?: string
	type: UserPaymentPreferencesTypeOptions
	updated?: IsoDateString
	user?: RecordIdString
}

export type UserProfilesRecord = {
	created?: IsoDateString
	id: string
	updated?: IsoDateString
	user?: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	date_of_birth?: IsoDateString
	email: string
	emailVisibility?: boolean
	first_name?: string
	id: string
	last_name?: string
	liked_products?: RecordIdString[]
	name?: string
	password: string
	phone?: string
	subscribed_to_newsletter?: boolean
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export enum VariantsTypeOptions {
	"COLOR" = "COLOR",
	"SIZE" = "SIZE",
	"SHAPE" = "SHAPE",
}
export type VariantsRecord = {
	created?: IsoDateString
	id: string
	product?: RecordIdString
	type?: VariantsTypeOptions
	updated?: IsoDateString
	value?: string
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type MessagesResponse<Texpand = unknown> = Required<MessagesRecord> & BaseSystemFields<Texpand>
export type MobileMerchantsResponse<Texpand = unknown> = Required<MobileMerchantsRecord> & BaseSystemFields<Texpand>
export type OrderItemsResponse<Texpand = unknown> = Required<OrderItemsRecord> & BaseSystemFields<Texpand>
export type OrdersResponse<Texpand = unknown> = Required<OrdersRecord> & BaseSystemFields<Texpand>
export type PopularProductGroupsResponse<Texpand = unknown> = Required<PopularProductGroupsRecord> & BaseSystemFields<Texpand>
export type ProductCategoriesResponse<Texpand = unknown> = Required<ProductCategoriesRecord> & BaseSystemFields<Texpand>
export type ProductRatingResponse<Texpand = unknown> = Required<ProductRatingRecord> & BaseSystemFields<Texpand>
export type ProductReviewsResponse<Texpand = unknown> = Required<ProductReviewsRecord> & BaseSystemFields<Texpand>
export type ProductsResponse<Texpand = unknown> = Required<ProductsRecord> & BaseSystemFields<Texpand>
export type SiteAdminsResponse<Texpand = unknown> = Required<SiteAdminsRecord> & AuthSystemFields<Texpand>
export type TagsResponse<Texpand = unknown> = Required<TagsRecord> & BaseSystemFields<Texpand>
export type UserPaymentPreferencesResponse<Texpand = unknown> = Required<UserPaymentPreferencesRecord> & BaseSystemFields<Texpand>
export type UserProfilesResponse<Texpand = unknown> = Required<UserProfilesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type VariantsResponse<Texpand = unknown> = Required<VariantsRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	messages: MessagesRecord
	mobile_merchants: MobileMerchantsRecord
	order_items: OrderItemsRecord
	orders: OrdersRecord
	popular_product_groups: PopularProductGroupsRecord
	product_categories: ProductCategoriesRecord
	product_rating: ProductRatingRecord
	product_reviews: ProductReviewsRecord
	products: ProductsRecord
	site_admins: SiteAdminsRecord
	tags: TagsRecord
	user_payment_preferences: UserPaymentPreferencesRecord
	user_profiles: UserProfilesRecord
	users: UsersRecord
	variants: VariantsRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	messages: MessagesResponse
	mobile_merchants: MobileMerchantsResponse
	order_items: OrderItemsResponse
	orders: OrdersResponse
	popular_product_groups: PopularProductGroupsResponse
	product_categories: ProductCategoriesResponse
	product_rating: ProductRatingResponse
	product_reviews: ProductReviewsResponse
	products: ProductsResponse
	site_admins: SiteAdminsResponse
	tags: TagsResponse
	user_payment_preferences: UserPaymentPreferencesResponse
	user_profiles: UserProfilesResponse
	users: UsersResponse
	variants: VariantsResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'messages'): RecordService<MessagesResponse>
	collection(idOrName: 'mobile_merchants'): RecordService<MobileMerchantsResponse>
	collection(idOrName: 'order_items'): RecordService<OrderItemsResponse>
	collection(idOrName: 'orders'): RecordService<OrdersResponse>
	collection(idOrName: 'popular_product_groups'): RecordService<PopularProductGroupsResponse>
	collection(idOrName: 'product_categories'): RecordService<ProductCategoriesResponse>
	collection(idOrName: 'product_rating'): RecordService<ProductRatingResponse>
	collection(idOrName: 'product_reviews'): RecordService<ProductReviewsResponse>
	collection(idOrName: 'products'): RecordService<ProductsResponse>
	collection(idOrName: 'site_admins'): RecordService<SiteAdminsResponse>
	collection(idOrName: 'tags'): RecordService<TagsResponse>
	collection(idOrName: 'user_payment_preferences'): RecordService<UserPaymentPreferencesResponse>
	collection(idOrName: 'user_profiles'): RecordService<UserProfilesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
	collection(idOrName: 'variants'): RecordService<VariantsResponse>
}
