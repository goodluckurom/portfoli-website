import { dynamicConfig, shouldBeDynamic } from '@/app/config';

export function getDynamicConfig(pathname: string) {
  return shouldBeDynamic(pathname) ? dynamicConfig : undefined;
}
