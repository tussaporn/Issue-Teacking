import {
	NgModule,
    ModuleWithProviders
}                                   from "@angular/core";
import {
	CommonModule
}									from "@angular/common";
import {
    ReactiveFormsModule,
    FormsModule
}                                   from "@angular/forms";
import {
	RouterModule
}									from "@angular/router";
import {
	NgbModule
}									from "@ng-bootstrap/ng-bootstrap";

import {
    BaBackTop,
    BaContentTop,
    BaMenu,
    BaMenuItem,
    BaPageTop,
    BaSidebar,

    CtmMessage,
    CtmScreenCommand,
    CtmSearchCriteria,
    CtmTable,
    CtmTextarea,
    CtmTextbox,
    CtmNumericTextbox,
    CtmSearchTextbox,

    Md2TooltipComponent,
    Md2Calendar,
    Md2CalendarTable,
    Md2Datepicker,
    Md2MonthView,
    Md2YearView,
    Md2Clock,

    Md2DialogModule,
    Md2Autocomplete,
    HighlightPipe,
    Md2Tooltip,
    DateLocale, 
    DateUtil    
}									from "./components";
import {
    BaThemePreloader,
    BaMenuService,
    BaThemeSpinner,

    ApiService,
    CtmApiSpinner,
    CtmMessageService,
    CtmTranslateService,
    CtmTableService,
    AutocompleteService,
    CtmCommandService
}                                   from "./services";
import {
    BaAppPicturePipe,
    BaKameleonPicturePipe,
    BaProfilePicturePipe,

    CtmTranslatePipe,
    CtmNationalityPicturePipe,
	CtmDatePipe,
	CtmNumericPipe
}                                   from "./pipes";
import {
    BaScrollPosition,
    BaSlimScroll
}                                   from "./directives";
import {
    OverlayModule, 
    CompatibilityModule,
    PlatformModule,
    PortalModule,
    StyleModule
}                                   from "./base/core";

const COMMON_COMPONENTS = [
	BaSidebar,
    BaMenuItem,
    BaMenu,
    BaBackTop,
    BaContentTop,
    BaPageTop,

    CtmMessage,
    CtmScreenCommand,
    CtmSearchCriteria,
    CtmTable,
    CtmTextarea,
    CtmTextbox,
    CtmNumericTextbox,
    CtmSearchTextbox,
    
    Md2TooltipComponent,
    Md2Calendar,
    Md2CalendarTable,
    Md2Datepicker,
    Md2MonthView,
    Md2YearView,
    Md2Clock
];
const COMMON_DIRECTIVES = [
    BaScrollPosition,
    BaSlimScroll,
    
    Md2Autocomplete,
    HighlightPipe,
    Md2Tooltip
];
const COMMON_PROVIDERS = [
    DateLocale, 
    DateUtil
];
const COMMON_PIPES = [
    BaAppPicturePipe,
    BaKameleonPicturePipe,
    BaProfilePicturePipe,
    
    CtmTranslatePipe,
    CtmNationalityPicturePipe,
	CtmDatePipe,
	CtmNumericPipe
];
const COMMON_SERVICES = [
    BaThemePreloader,
    BaThemeSpinner,
    BaMenuService,

    ApiService,
    CtmApiSpinner,
    CtmMessageService,
    CtmTranslateService,
    CtmTableService,
    AutocompleteService,
    CtmCommandService    
];

const MD2_MODULES = [
  Md2DialogModule
];

@NgModule({
    declarations: [
		...COMMON_PIPES,
        ...COMMON_DIRECTIVES,
        ...COMMON_COMPONENTS  
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,

        OverlayModule, 
        CompatibilityModule, 
        PlatformModule,
        PortalModule,
        StyleModule,
        Md2DialogModule.forRoot()
    ],
    providers: [
        ...COMMON_PROVIDERS
    ],
    exports: [
		...COMMON_PIPES,
        ...COMMON_DIRECTIVES,
        ...COMMON_COMPONENTS,
        ...MD2_MODULES
    ],
    entryComponents: [
        Md2TooltipComponent,
        Md2Datepicker
    ]
})
export class CtmModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: CtmModule,
            providers: [
                ...COMMON_SERVICES
            ]
        };
    }
}