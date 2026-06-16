import { TestBed } from '@angular/core/testing';
import { SeoService } from './seo.service';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

describe('@SeoService', () => {
	let service: SeoService;
	let titleService: any;
	let metaService: any;
	let mockDocument: any;

	beforeEach(() => {
		const titleSpy = { setTitle: vi.fn() };
		const metaSpy = { updateTag: vi.fn() };
		
		mockDocument = {
			getElementsByTagName: vi.fn().mockReturnValue([
				{ appendChild: vi.fn() }
			]),
			querySelector: vi.fn().mockReturnValue(null),
			createElement: vi.fn().mockReturnValue({
				setAttribute: vi.fn()
			}),
			URL: 'http://test.com/path?param=1'
		};

		TestBed.configureTestingModule({
			providers: [
				SeoService,
				{ provide: Title, useValue: titleSpy },
				{ provide: Meta, useValue: metaSpy },
				{ provide: DOCUMENT, useValue: mockDocument }
			]
		});

		service = TestBed.inject(SeoService);
		titleService = TestBed.inject(Title);
		metaService = TestBed.inject(Meta);
	});

	it('#Should set the title with suffix When setSeoData is called', () => {
		// Arrange
		const title = 'Test Product';

		// Act
		service.setSeoData(title, 'desc');

		// Assert
		expect(titleService.setTitle).toHaveBeenCalledWith('Test Product | Inkafarma');
	});

	it('#Should update the description meta tag When setSeoData is called', () => {
		// Arrange
		const description = 'Product desc';

		// Act
		service.setSeoData('title', description);

		// Assert
		expect(metaService.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Product desc' });
	});

	it('#Should append script tag for structured data When addJsonLd is called', () => {
		// Arrange
		const product = { sNameProduct: 'Test', sDescription: '<p>Desc</p>', sSku: '123', sBrand: 'B', nPromotionalPrice: 10 };
		const mockScript = { setAttribute: vi.fn(), id: '', type: '', text: '' };
		mockDocument.createElement.mockReturnValue(mockScript);

		// Act
		service.addJsonLd(product);

		// Assert
		expect(mockDocument.getElementsByTagName()[0].appendChild).toHaveBeenCalledWith(mockScript);
	});

	it('#Should remove existing script tag When addJsonLd is called and script already exists', () => {
		// Arrange
		const product = { sNameProduct: 'Test', sDescription: '<p>Desc</p>', sSku: '123', sBrand: 'B', nPromotionalPrice: 10 };
		const existingScript = { id: 'structured-data' };
		mockDocument.querySelector.mockReturnValue(existingScript);
		const headNode = mockDocument.getElementsByTagName()[0];
		headNode.removeChild = vi.fn();

		// Act
		service.addJsonLd(product);

		// Assert
		expect(headNode.removeChild).toHaveBeenCalledWith(existingScript);
	});
});
