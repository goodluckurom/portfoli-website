import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import type { IconName } from '@/components/icons';
import { socialPlatforms } from '@/lib/validations/settings';
import type { SettingsFormValues } from '@/lib/validations/settings';
import { SocialPlatform } from '@prisma/client';

const socialPlatformIcons: Record<SocialPlatform, IconName> = {
  [SocialPlatform.GITHUB]: 'github',
  [SocialPlatform.TWITTER]: 'twitter',
  [SocialPlatform.LINKEDIN]: 'linkedin',
  [SocialPlatform.INSTAGRAM]: 'instagram',
  [SocialPlatform.FACEBOOK]: 'facebook',
  [SocialPlatform.YOUTUBE]: 'youtube',
  [SocialPlatform.DRIBBBLE]: 'globe',
  [SocialPlatform.BEHANCE]: 'globe',
  [SocialPlatform.MEDIUM]: 'globe',
  [SocialPlatform.DEVTO]: 'code',
  [SocialPlatform.WEBSITE]: 'globe',
  [SocialPlatform.OTHER]: 'link'
};

export function SocialLinksForm() {
  const { control } = useFormContext<SettingsFormValues>();
  const { fields, append, remove } = useFieldArray({
    name: 'socialLinks',
    control,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel className="text-base">Social Links</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => append({ 
            platform: SocialPlatform.GITHUB, 
            url: '',
            name: '',
            icon: ''
          })}
        >
          <Icons name="add" className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <FormField
              control={control}
              name={`socialLinks.${index}.platform`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {socialPlatforms.map((platform) => (
                          <SelectItem 
                            key={platform} 
                            value={platform}
                          >
                            <div className="flex items-center">
                              <Icons
                                name={socialPlatformIcons[platform as SocialPlatform]}
                                className="mr-2 h-4 w-4"
                              />
                              {platform.split('_')
                                .map(word => word.charAt(0) + word.slice(1).toLowerCase())
                                .join(' ')}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`socialLinks.${index}.url`}
              render={({ field }) => (
                <FormItem className="flex-[2]">
                  <FormControl>
                    <Input placeholder="URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <Icons name="trash" className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
